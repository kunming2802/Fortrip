'use client'

import { useState, useEffect } from 'react'
import { Member, Expense } from '@/lib/types'
import { generateId } from '@/lib/trip-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'

interface ExpenseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  members: Member[]
  dayIndex: number
  onAddExpense: (expense: Expense) => void
}

export function ExpenseForm({ open, onOpenChange, members, dayIndex, onAddExpense }: ExpenseFormProps) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState('')
  const [splitWith, setSplitWith] = useState<string[]>([])

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setDescription('')
      setAmount('')
      setPaidBy(members[0]?.id || '')
      setSplitWith(members.map((m) => m.id))
    }
  }, [open, members])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !amount || !paidBy || splitWith.length === 0) return

    onAddExpense({
      id: generateId(),
      dayIndex,
      description,
      amount: parseFloat(amount),
      paidBy,
      splitWith,
    })

    onOpenChange(false)
  }

  const toggleSplit = (memberId: string) => {
    setSplitWith((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    )
  }

  const selectAll = () => setSplitWith(members.map((m) => m.id))
  const clearAll = () => setSplitWith([])

  const perPerson = splitWith.length > 0 && amount ? parseFloat(amount) / splitWith.length : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>เพิ่มรายจ่าย - วันที่ {dayIndex + 1}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>รายละเอียด</FieldLabel>
              <Input
                placeholder="เช่น ค่าอาหาร, ค่ารถ..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel>จำนวนเงิน (บาท)</FieldLabel>
              <Input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </Field>

            <Field>
              <FieldLabel>ผู้จ่ายเงิน</FieldLabel>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกคนจ่าย" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${member.color}`} />
                        {member.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel>หารกับใครบ้าง</FieldLabel>
                <div className="flex gap-2 text-xs">
                  <button type="button" onClick={selectAll} className="text-primary hover:underline">
                    เลือกทั้งหมด
                  </button>
                  <span className="text-muted-foreground">|</span>
                  <button type="button" onClick={clearAll} className="text-primary hover:underline">
                    ล้าง
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {members.map((member) => (
                  <label
                    key={member.id}
                    className="flex items-center gap-2 rounded-lg border p-2 cursor-pointer hover:bg-secondary/50 transition-colors"
                  >
                    <Checkbox
                      checked={splitWith.includes(member.id)}
                      onCheckedChange={() => toggleSplit(member.id)}
                    />
                    <div className={`h-3 w-3 rounded-full ${member.color}`} />
                    <span className="text-sm">{member.name}</span>
                  </label>
                ))}
              </div>
            </Field>
          </FieldGroup>

          {splitWith.length > 0 && amount && (
            <div className="rounded-lg bg-secondary p-3 text-center">
              <p className="text-sm text-muted-foreground">คนละ</p>
              <p className="text-2xl font-bold text-primary">
                {perPerson.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿
              </p>
              <p className="text-xs text-muted-foreground">
                ({splitWith.length} คน)
              </p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={!description || !amount || !paidBy || splitWith.length === 0}>
            เพิ่มรายจ่าย
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
