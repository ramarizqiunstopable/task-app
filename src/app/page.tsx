import TaskList from "@/components/TaskList";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-10">Welcome to the Task App</h1>
      <TaskList />
    </main>
  );
}
