# Technical Evaluation: Oracle Cloud Infrastructure (OCI) Alternative

**Project:** NewtronLabs / 3D Printing Wallah  
**Scope:** Architectural Assessment of OCI Ampere Compute & Oracle Database Alternatives  
**Status:** Comparative Analysis & Future Feasibility Study  
**Recommendation:** Do NOT introduce Oracle in initial deployment; retain Neon PostgreSQL.  

---

## 1. Executive Summary

The prompt explicitly stipulates:
> "Optional future infrastructure: Oracle Cloud Infrastructure may be evaluated later for additional compute or self-hosted PostgreSQL. Do not introduce Oracle into the initial deployment. Do not use Oracle Autonomous Database as the primary database unless a separate compatibility assessment justifies it."

This document audits Oracle Cloud Infrastructure (OCI) Always Free resources, compares self-hosted PostgreSQL on OCI Ampere A1 against managed Neon PostgreSQL, evaluates Oracle Autonomous Database, and defines the exact threshold conditions under which an OCI migration would become economically and architecturally justified.

---

## 2. OCI Always Free Resource Profile

OCI provides one of the most generous permanent free tiers in cloud computing:
- **Compute:** Up to 4 OCPU of Arm-based Ampere A1 cores and 24 GB of RAM (allocatable as 1 large VM or multiple smaller instances).
- **Block Storage:** 200 GB total boot/block storage across all VMs.
- **Outbound Data Transfer:** 10 TB/month free.
- **Regions in India:** Mumbai (`ap-mumbai-1`) and Hyderabad (`ap-hyderabad-1`).

---

## 3. Head-to-Head Comparison: Neon vs. OCI Self-Hosted PostgreSQL

| Architectural Dimension | Neon PostgreSQL (Managed Serverless) | Self-Hosted PostgreSQL on OCI Ampere A1 |
|---|---|---|
| **Operational Overhead** | **Zero.** Fully managed, automatic minor upgrades, zero OS maintenance. | **High.** Requires Linux administration, kernel tuning, security patching, firewall rules, and SSL renewal (Certbot). |
| **Connection Pooling** | **Built-in PgBouncer pooler** designed specifically for serverless edge workers. | **Manual setup.** Must deploy, tune, and monitor PgBouncer or Pgpool-II manually. |
| **Cloudflare Workers Integration** | **Native WebSocket driver** (`@neondatabase/serverless`) + `@prisma/adapter-neon`. | **Difficult on Edge.** Edge workers cannot open raw TCP sockets to arbitrary VM ports without Cloudflare Workers Socket APIs or a REST gateway. |
| **High Availability & Backups** | **Built-in point-in-time recovery (PITR)** and instant database branching. | **Manual.** Requires configuring `pg_dump` cron jobs, WAL-G / pgBackRest to object storage, and disaster recovery testing. |
| **Edge Cold Start Latency** | ~200ms to 400ms when resuming from auto-suspend. | **0ms cold start** (VM is always running). |
| **Initial Cost** | **$0.00 / month** on Neon Free Tier (0.5 GiB). | **$0.00 / month** on OCI Always Free. |
| **Long-Term Scaling Cost** | $19/month for Neon Launch plan when exceeding 0.5 GiB. | **$0.00** up to 200 GB disk and 24 GB RAM. |

---

## 4. Evaluation of Oracle Autonomous Database (ADB)

Oracle offers 2 Always Free Autonomous Database instances (Transaction Processing or Data Warehouse), each with 1 OCPU and 20 GB storage.

### Why Oracle Autonomous Database is REJECTED for NewtronLabs:
1. **Prisma ORM Incompatibility:**
   Prisma has **no native driver adapter for Oracle Database** in serverless/edge environments. Connecting requires custom Knex or TypeORM queries with the `oracledb` node add-on, which **cannot run** in Cloudflare Workers V8 isolates.
2. **Proprietary Dialect Quirks:**
   Oracle PL/SQL syntax for JSON manipulation, identity sequences, and pagination differences create massive code complexity compared to standard PostgreSQL.
3. **Connection Wallet Complexity:**
   Autonomous Database enforces mutual TLS (mTLS) with proprietary `cwallet.sso` credential zip packages, creating operational hurdles inside containerized or serverless edge environments.
4. **Account Inactivity Reclamation Risk:**
   Oracle actively reclaims Always Free Autonomous Databases if they register low CPU consumption over 7 consecutive days, risking catastrophic storefront downtime.

---

## 5. Architectural Recommendation & Trigger Thresholds

### Initial Deployment Decision:
**Retain Neon PostgreSQL.** Neon is 100% standard PostgreSQL, natively integrated with Prisma and Cloudflare Workers, and requires zero DevOps maintenance.

### When to Consider OCI Ampere Self-Hosting:
Migrating to OCI Ampere self-hosted PostgreSQL should only be considered when **both** of the following conditions are met:
1. **Storage Growth Threshold:**
   When NewtronLabs database storage exceeds 50 GB and continuous Neon storage costs exceed $50–$100/month.
2. **Dedicated CAD Processing Worker:**
   If NewtronLabs builds automated 3D mesh repair, slicing estimation (running CLI PrusaSlicer/OrcaSlicer), or automated thumbnail rendering, an OCI Ampere 4-core / 24GB RAM instance is the ideal zero-cost compute worker to process jobs from a Redis queue.
