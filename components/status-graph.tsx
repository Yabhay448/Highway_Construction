"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format, startOfDay, addMonths } from "date-fns"
import { useTasks } from "@/context/task-context"

export default function StatusGraph() {
  const { tasks, isLoading } = useTasks()

  if (isLoading) {
    return <div className="text-center py-8">Loading dashboard data...</div>
  }

  // Transform and sort tasks by start date
  const statusGraphData = tasks.map(task => ({
    title: task.title,
    startDate: new Date(task.startDate),
    endDate: new Date(task.dueDate),
    status: task.status
  })).sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

  // Set timeline range for April to June 2025
  const timelineStart = startOfDay(new Date(2025, 3, 1)) // Changed to April
  const timelineEnd = new Date(2025, 5, 30)   // June

  // Calculate position based on date
  const getDatePosition = (date: Date) => {
    const total = timelineEnd.getTime() - timelineStart.getTime()
    const position = date.getTime() - timelineStart.getTime()
    return (position / total) * 100
  }

  // Generate month markers (3 months instead of 4)
  const monthMarkers = Array.from({ length: 3 }, (_, i) => addMonths(timelineStart, i))

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b border-border">
        <CardTitle>Project Timeline</CardTitle>
        <CardDescription>Task schedule and progress</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative h-[600px] overflow-y-auto">
          {/* Task names column - Fixed */}
          <div className="absolute left-0 top-0 w-72 bg-background z-20">
            <div className="h-14 border-b border-border" /> {/* Header spacer */}
            <div className="space-y-4 py-6">
              {statusGraphData.map((task, index) => (
                <div key={index} className="h-12 flex items-center px-4">
                  <span className="font-medium text-base truncate">
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline section */}
          <div className="ml-72"> {/* Offset by task names width */}
            {/* Month headers - Sticky */}
            <div className="grid grid-cols-3 border-b border-border bg-card sticky top-0 z-10">
              {monthMarkers.map((date, i) => (
                <div 
                  key={i} 
                  className="text-center py-4 text-base font-medium border-r border-border last:border-r-0"
                >
                  {format(date, 'MMMM yyyy')}
                </div>
              ))}
            </div>
            
            {/* Tasks timeline */}
            <div className="relative">
              {/* Vertical grid lines */}
              <div className="absolute inset-0 grid grid-cols-3 pointer-events-none h-full">
                {monthMarkers.map((_, i) => (
                  <div key={i} className="border-r border-border/30 last:border-r-0" />
                ))}
              </div>

              {/* Timeline bars */}
              <div className="space-y-4 py-6">
                {statusGraphData.map((task, index) => {
                  const startPos = getDatePosition(task.startDate)
                  const duration = getDatePosition(task.endDate) - startPos
                  
                  return (
                    <div key={index} className="h-12 flex items-center">
                      <div className="flex-1 relative px-4">
                        <div
                          className="absolute h-3 bg-primary/80 rounded-full" // Changed from h-6 to h-1, removed rounded-full and other styles
                          style={{
                            left: `${startPos}%`,
                            width: `${Math.max(duration, 1)}%`,
                            top: '50%',
                            transform: 'translateY(-50%)'
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}