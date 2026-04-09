'use client'

import { useState } from 'react'
import { Member } from '@/lib/types'
import { generateId, getNextColor } from '@/lib/trip-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, X, Users } from 'lucide-react'

interface MemberManagerProps {
  members: Member[]
  onAddMember: (member: Member) => void
  onRemoveMember: (id: string) => void
}

export function MemberManager({ members, onAddMember, onRemoveMember }: MemberManagerProps) {
  const [newName, setNewName] = useState('')

  const handleAdd = () => {
    if (newName.trim()) {
      onAddMember({
        id: generateId(),
        name: newName.trim(),
        color: getNextColor(members),
      })
      setNewName('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5" />
          สมาชิกในทริป
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="ชื่อสมาชิก..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button onClick={handleAdd} size="icon" disabled={!newName.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm"
            >
              <div className={`h-3 w-3 rounded-full ${member.color}`} />
              <span>{member.name}</span>
              <button
                onClick={() => onRemoveMember(member.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {members.length === 0 && (
            <p className="text-sm text-muted-foreground">ยังไม่มีสมาชิก เพิ่มสมาชิกเพื่อเริ่มต้น</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
