import { Alert } from 'react-bootstrap';

interface LayoutProps {
  children: React.ReactNode;
}

const ErrorMessage: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Alert variant={"info"} style = {{ fontSize: 20 }}>
      <strong>{ children }</strong>
    </Alert>
  );
};

export default ErrorMessage;