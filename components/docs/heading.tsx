"use client";

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  id?: string;
}

export function Heading({ level = 1, children, id }: HeadingProps) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Component 
      id={id} 
      className={`
        scroll-m-20
        ${level === 1 ? 'text-4xl font-extrabold tracking-tight lg:text-5xl' : ''}
        ${level === 2 ? 'text-3xl font-semibold tracking-tight mt-10 first:mt-0' : ''}
        ${level === 3 ? 'text-2xl font-semibold tracking-tight mt-8' : ''}
        ${level === 4 ? 'text-xl font-semibold tracking-tight mt-6' : ''}
        ${level === 5 ? 'text-lg font-semibold tracking-tight mt-4' : ''}
        ${level === 6 ? 'text-base font-semibold tracking-tight mt-4' : ''}
      `}
    >
      {children}
    </Component>
  );
}