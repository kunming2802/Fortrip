'use client'

import { useState } from 'react'
import { Member, Expense, TripDay } from '@/lib/types'
import { MemberManager } from './member-manager'
import { DayCard } from './day-card'
import { SummaryCard } from './summary-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, MapPin, Plane } from 'lucide-react'

export function TripManager() {
  const [tripName, setTripName] = useState('ทริปสนุกสนาน')
  const [members, setMembers] = useState<Member[]>([])
  const [days, setDays] = useState<TripDay[]>([
    { dayNumber: 1, date: '', expenses: [] },
  ])

  const addMember = (member: Member) => {
    setMembers((prev) => [...prev, member])
  }

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id))
    // Also remove member from all expenses
    setDays((prev) =>
      prev.map((day) => ({
        ...day,
        expenses: day.expenses
          .filter((e) => e.paidBy !== id)
          .map((e) => ({
            ...e,
            splitWith: e.splitWith.filter((memberId) => memberId !== id),
          }))
          .filter((e) => e.splitWith.length > 0),
      }))
    )
  }

  const addDay = () => {
    setDays((prev) => [
      ...prev,
      { dayNumber: prev.length + 1, date: '', expenses: [] },
    ])
  }

  const removeDay = (dayNumber: number) => {
    if (days.length <= 1) return
    setDays((prev) =>
      prev
        .filter((d) => d.dayNumber !== dayNumber)
        .map((d, i) => ({ ...d, dayNumber: i + 1 }))
    )
  }

  const addExpense = (expense: Expense) => {
    setDays((prev) =>
      prev.map((day) =>
        day.dayNumber === expense.dayIndex + 1
          ? { ...day, expenses: [...day.expenses, expense] }
          : day
      )
    )
  }

  const removeExpense = (dayNumber: number, expenseId: string) => {
    setDays((prev) =>
      prev.map((day) =>
        day.dayNumber === dayNumber
          ? { ...day, expenses: day.expenses.filter((e) => e.id !== expenseId) }
          : day
      )
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <Plane className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <Input
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                className="text-xl font-bold border-none p-0 h-auto bg-transparent focus-visible:ring-0"
                placeholder="ชื่อทริป..."
              />
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {days.length} วัน • {members.length} คน
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Days */}
          <div className="lg:col-span-2 space-y-4">
            {/* Member Manager */}
            <MemberManager
              members={members}
              onAddMember={addMember}
              onRemoveMember={removeMember}
            />

            {/* Days */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">รายจ่ายแต่ละวัน</CardTitle>
                  <Button onClick={addDay} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    เพิ่มวัน
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {days.map((day) => (
                  <div key={day.dayNumber} className="relative">
                    {days.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 z-10 h-7 w-7 rounded-full bg-background border shadow-sm text-muted-foreground hover:text-destructive"
                        onClick={() => removeDay(day.dayNumber)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <DayCard
                      day={day}
                      members={members}
                      onAddExpense={addExpense}
                      onRemoveExpense={(expenseId) => removeExpense(day.dayNumber, expenseId)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <SummaryCard members={members} days={days} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
