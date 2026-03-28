import { BellAlert } from '@medusajs/icons'
import { IconButton } from '@medusajs/ui'

export function NotificationsBell() {
  return (
    <div className="relative">
      <IconButton
        aria-label="Thông báo"
        className="cursor-pointer border-none bg-transparent shadow-none hover:text-ui-fg-base hover:bg-transparent! active:bg-transparent! focus:bg-transparent!"
      >
        <BellAlert className="h-4.5 w-4.5" />
      </IconButton>
      <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-ui-tag-red-icon" />
    </div>
  )
}
