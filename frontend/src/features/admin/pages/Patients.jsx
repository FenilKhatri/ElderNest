import { motion } from 'framer-motion';
import { stagger, fadeUp } from '../../../animations/motionVariants';

const Patients = () => {
  return (
    <motion.div variants={stagger} initial='hidden' animate='show' className='space-y-6'>
      <motion.div variants={fadeUp} className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>Patients</h1>
          <p className='text-slate-500 dark:text-slate-400 mt-1'>Manage Patients.</p>
        </div>
      </motion.div>
      <motion.div variants={fadeUp} className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500'>
        This module is currently under development. Data will be populated from the backend APIs once fully integrated.
      </motion.div>
    </motion.div>
  );
};

export default Patients;
