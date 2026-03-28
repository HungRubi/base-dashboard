/** Trả về URL hiển thị file (mock: path tương đối hoặc URL đầy đủ). */
export function getDocumentFileUrl(path: string | null | undefined): string | null {
	const p = path?.trim()
	if (!p) return null
	if (p.startsWith('http://') || p.startsWith('https://')) return p
	return p.startsWith('/') ? p : `/${p}`
}

/** Chuỗi preview có thể là nhiều URL phân tách bởi dấu phẩy hoặc xuống dòng. */
export function parseDocumentPreviewUrls(raw: string | null | undefined): string[] {
	if (!raw?.trim()) return []
	return raw
		.split(/[,\n]/)
		.map((s) => s.trim())
		.filter(Boolean)
}
