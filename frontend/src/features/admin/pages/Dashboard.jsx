import { dashboardCard } from "../data/adminData";

const Dashboard = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {
          dashboardCard?.map((data) => {
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow">
              <h2 className="text-sm text-gray-500">{data?.title}</h2>
              <p className="text-2xl font-bold">{data?.count}</p>
            </div>;
          })
        }
      </div>
    </>
  );
}

export default Dashboard