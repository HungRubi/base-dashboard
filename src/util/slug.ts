/** Slug đơn giản từ tiêu đề (ASCII hóa cơ bản; có thể thay bằng thư viện slug tiếng Việt sau). */
export function createSlug(title: string): string {
	return title
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
}
