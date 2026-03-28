import type { ActionCreatorWithoutPayload } from '@reduxjs/toolkit'
import { toast } from '@medusajs/ui'
import { useEffect } from 'react'
import type { AppDispatch } from '../store'

/**
 * Khi slice báo lỗi danh sách: hiện toast rồi dispatch action xóa flag.
 */
export function useToastOnListError(
	listError: string | null | undefined,
	dispatch: AppDispatch,
	clearListError: ActionCreatorWithoutPayload,
) {
	useEffect(() => {
		if (!listError) return
		toast.error(listError)
		dispatch(clearListError())
	}, [listError, dispatch, clearListError])
}
