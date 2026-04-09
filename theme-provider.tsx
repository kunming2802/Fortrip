'use client'

import { Member, TripDay } from '@/lib/types'
import { calculateSettlements, getTotalExpenses, getMemberTotalPaid, getMemberTotalOwes } from '@/lib/trip-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Calculator, Wallet, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react'

interface SummaryCardProps {
  members: Member[]
  days: TripDay[]
}

export function SummaryCard({ members, days }: SummaryCardProps) {
  const settlements = calculateSettlements(members, days)
  const totalExpenses = getTotalExpenses(days)

  const memberStats = members.map((member) => {
    const paid = getMemberTotalPaid(member.id, days)
    const owes = getMemberTotalOwes(member.id, days)
    const balance = paid - owes

    return {
      member,
      paid,
      owes,
      balance,
    }
  })

  if (members.length === 0 || totalExpenses === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5" />
            สรุปค่าใช้จ่าย
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>เพิ่มสมาชิกและรายจ่ายเพื่อดูสรุป</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3 bg-primary/5">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5" />
          สรุปค่าใช้จ่าย
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        {/* Total */}
        <div className="text-center py-4 rounded-lg bg-secondary">
          <p className="text-sm text-muted-foreground">ค่าใช้จ่ายทั้งหมด</p>
          <p className="text-3xl font-bold text-primary">
            {totalExpenses.toLocaleString('th-TH')} ฿
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            เฉลี่ยคนละ {(totalExpenses / members.length).toLocaleString('th-TH', { maximumFractionDigits: 2 })} ฿
          </p>
        </div>

        {/* Member Stats */}
        <div>
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            รายละเอียดแต่ละคน
          </h3>
          <div className="space-y-2">
            {memberStats.map(({ member, paid, owes, balance }) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-2">
                  <div className={`h-4 w-4 rounded-full ${member.color}`} />
                  <span className="font-medium">{member.name}</span>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      จ่ายไป: {paid.toLocaleString('th-TH')} ฿
                    </span>
                    <span className="text-muted-foreground">
                      ต้องจ่าย: {owes.toLocaleString('th-TH', { maximumFractionDigits: 2 })} ฿
                    </span>
                  </div>
                  <div className={`flex items-center justify-end gap-1 font-medium ${balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {balance >= 0 ? (
                      <TrendingUp className="h-3.5 w-3.5" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" />
                    )}
                    {balance >= 0 ? '+' : ''}
                    {balance.toLocaleString('th-TH', { maximumFractionDigits: 2 })} ฿
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settlements */}
        <div>
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            วิธีชำระเงิน
          </h3>
          {settlements.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground rounded-lg bg-secondary/50">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
              <p>ไม่ต้องโอนเงินกัน - ทุกคนจ่ายเท่าๆ กันแล้ว!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {settlements.map((settlement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-amber-900">{settlement.from}</span>
                    <ArrowRight className="h-4 w-4 text-amber-600" />
                    <span className="font-medium text-amber-900">{settlement.to}</span>
                  </div>
                  <span className="font-bold text-amber-700">
                    {settlement.amount.toLocaleString('th-TH', { maximumFractionDigits: 2 })} ฿
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
