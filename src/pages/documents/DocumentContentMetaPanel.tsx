import type { ContentMetaView } from './documentContentMeta'

export function DocumentContentMetaPanel({ view }: { view: ContentMetaView }) {
	if (view.variant === 'empty') return null
	return (
		<pre className="max-h-64 overflow-auto rounded-md border border-ui-border-base bg-ui-bg-subtle p-3 font-mono text-xs text-ui-fg-base">
			{view.raw}
		</pre>
	)
}
