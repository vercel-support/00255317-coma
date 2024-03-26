interface HeadingI {
  title: string;
  description: string;
}

export const SubHeading: React.FC<HeadingI> = ({ title, description }) => {
  return (
    <div>
      <h2 className="text-3xl leading-6 font-bold tracking-tight">{title}</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground ">
        {description}
      </p>
    </div>
  );
};
