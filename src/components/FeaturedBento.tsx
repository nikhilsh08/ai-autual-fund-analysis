
import { Button } from './ui/button';
import Coursecard from './Coursecard';
import { getCoursesAction } from '@/server/actions/get-courses';

// Server Components can be async!
const FeaturedBento = async () => {
  const courses = await getCoursesAction();

  return (
    <section className="py-32 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-center mb-16">
          <div className="text-center">
            <span className="text-xs font-medium text-blue-600 uppercase tracking-widest mb-2 block">Curriculum</span>
            <h2 className="text-4xl font-medium tracking-tighter text-zinc-900">
              Where our students <span className="text-zinc-400">specialize</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <Coursecard 
              key={course.id}
              course={course}
            />
          ))}
        </div>
        
        {/* <div className="mt-12 text-center">
          <Button variant="secondary" className="px-8">View All Courses</Button>
        </div> */}
      </div>
    </section>
  );
};

export default FeaturedBento;