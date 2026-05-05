const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-300 animate-pulse",
    Synced: "bg-green-100 text-green-700 border-green-300",
    Failed: "bg-red-100 text-red-700 border-red-300"
  };

  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${styles[status]}`}>
      {status === 'Pending' ? 'SYNCING...' : status.toUpperCase()}
    </span>
  );
};
export default StatusBadge;