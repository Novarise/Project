interface HeadingProps {
    title: string;
    description: string;
    size?: string;
    weight?: string;
  }
  
  export const Heading: React.FC<HeadingProps> = ({
    title,
    description,
    size,
    weight
  }) => {
    size = !size ? "3xl" : size
    weight = !weight ? "bold" : weight
    return ( 
      <div>
        <h2 className={`text-${size} font-${weight} tracking-tight`}>{title}</h2>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    );
  };
   