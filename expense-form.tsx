'use client'

import { useState } from 'react'
import { Member, Expense, TripDay } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExpenseForm } from './expense-form'
import { Plus, Trash2, Calendar, Receipt } from 'lucide-react'

interface DayCardProps {
  day: TripDay
  members: Member[]
  onAddExpense: (expense: Expense) => void
  onRemoveExpense: (expenseId: string) => void
}

export function DayCard({ day, members, onAddExpense, onRemoveExpense }: DayCardProps) {
  const [showForm, setShowForm] = useState(false)

  const getMember = (id: string) => members.find((m) => m.id === id)

  const dayTotal = day.expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              วันที่ {day.dayNumber}
            </CardTitle>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">รวมทั้งวัน</p>
              <p className="text-lg font-bold text-primary">
                {dayTotal.toLocaleString('th-TH')} ฿
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {day.expenses.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Receipt className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">ยังไม่มีรายจ่าย</p>
            </div>
          ) : (
            <div className="space-y-2">
              {day.expenses.map((expense) => {
                const payer = getMember(expense.paidBy)
                const splitMembers = expense.splitWith.map(getMember).filter(Boolean) as Member[]
                const perPerson = expense.amount / expense.splitWith.length

                return (
                  <div
                    key={expense.id}
                    className="rounded-lg border p-3 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{expense.description}</p>
                          <span className="text-lg font-bold text-primary shrink-0">
                            {expense.amount.toLocaleString('th-TH')} ฿
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                          {payer && (
                            <>
                              <div className={`h-2.5 w-2.5 rounded-full ${payer.color}`} />
                              <span>{payer.name} จ่าย</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                          <span className="text-xs text-muted-foreground mr-1">หาร:</span>
                          {splitMembers.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center gap-1 bg-secondary rounded-full px-2 py-0.5 text-xs"
                            >
                              <div className={`h-2 w-2 rounded-full ${member.color}`} />
                              {member.name}
                            </div>
                          ))}
                          <span className="text-xs text-muted-foreground ml-2">
                            (คนละ {perPerson.toLocaleString('th-TH', { maximumFractionDigits: 2 })} ฿)
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => onRemoveExpense(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowForm(true)}
            disabled={members.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มรายจ่าย
          </Button>
        </CardContent>
      </Card>

      <ExpenseForm
        open={showForm}
        onOpenChange={setShowForm}
        members={members}
        dayIndex={day.dayNumber - 1}
        onAddExpense={onAddExpense}
      />
    </>
  )
}
