import PagePlaceholder from "../../../components/ui/PagePlaceholder";
import { dashboardCard } from "../data/adminData";

const Dashboard = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {dashboardCard?.map((data) => (
          <div key={data.title} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow">
            <h2 className="text-sm text-gray-500 dark:text-gray-400">{data?.title}</h2>
            <p className="text-2xl font-bold dark:text-white">{data?.count}</p>
          </div>
        ))}
      </div>

      <PagePlaceholder
        title="Admin Dashboard"
        description="Analytics and management features will be connected to live data soon."
      />
    </>
  );
};

export default Dashboard;