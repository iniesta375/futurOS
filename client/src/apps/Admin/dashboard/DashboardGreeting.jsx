export default function DashboardGreeting() {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-5xl font-bold tracking-tight">
          {greeting}
          
        </h1>

        <p className="mt-2 text-white/50">
          {today}
        </p>
      </div>

      <p className="max-w-2xl text-white/65 leading-relaxed">
        Manage your FuturOS portfolio from one place.
        Track projects, skills, analytics and keep
        everything running smoothly.
      </p>
    </div>
  );
}