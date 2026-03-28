type SectionPageProps = {
	title: string;
	description: string;
};

export function SectionPage({ title, description }: SectionPageProps) {
	return (
		<section className='rounded-xl border border-ui-border-base bg-ui-bg-base p-6 shadow-elevation-card-rest'>
			<h2 className='text-xl font-semibold text-ui-fg-base'>{title}</h2>
			<p className='mt-2 text-sm text-ui-fg-subtle'>{description}</p>
		</section>
	);
}
