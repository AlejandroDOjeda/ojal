type Props = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <>
      {icon && (
        <div className="mb-4 text-muted-foreground/40">{icon}</div>
      )}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </>
  );
}
