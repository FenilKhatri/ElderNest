const Dashboard = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Total Users</h2>
          <p className="text-2xl font-bold">120</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Bookings</h2>
          <p className="text-2xl font-bold">45</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Complaints</h2>
          <p className="text-2xl font-bold">8</p>
        </div>
      </div>
    </>
  );
}

export default Dashboard