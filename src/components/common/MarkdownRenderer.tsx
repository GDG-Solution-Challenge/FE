interface Props {
  content: string;
}

const MarkdownRenderer = ({ content }: Props) => {
  return <div>{content}</div>;
};

export default MarkdownRenderer;
