# Multi-Cloud Data Replication & Disaster Recovery (DR) System

### Project Overview
A resilient data replication system across **AWS S3** and **Azure Blob Storage** ensuring high availability and disaster recovery.

### Key Features
- **Asynchronous Replication:** Automated data sync from AWS (Primary) to Azure (Secondary) with a controlled 1-minute latency.
- **Failover Simulation:** One-click "Disaster Recovery" mode to switch traffic to Azure if AWS fails.
- **Real-time Monitoring:** Admin dashboard with Recharts to track sync status and replication latency.
- **Secure Transmission:** AES-256 encryption-at-rest (Cloud native) and secure API endpoints.

### Tech Stack
- **Frontend:** React.js (Vite), Tailwind CSS, Recharts, Lucide Icons.
- **Backend:** Node.js, Express.js, Multer.
- **Cloud:** AWS SDK (S3), Azure Storage SDK (Blob).
- **Database:** MongoDB Atlas.

### Project Milestones (Plag Pro)
1. Study multi-cloud architecture concepts. ✅
2. Configure AWS S3 & Azure Blob storage. ✅
3. Automated 1-min replication workflow. ✅
4. Implement Failover strategy logic. ✅
5. Monitoring & Analytics Framework. ✅