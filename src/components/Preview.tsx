import { useRef, useEffect } from 'react';
import '../styles/preview.css';

interface PreviewProps {
  code: string;
}

const html = `
    <html>
      <head>
        <style>html { background-color: white; }</style>
      </head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', event => {
            try {
              eval(event.data);
            } catch (err) {
              const root = document.getElementById('root');
              root.innerHTML = '<div style="color: #d40511;"><h4>Runtime Error</h4>' + err + '</div>';
              console.error(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html; // Reset the iframe contents when new code is input
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);

  return (
    <div className='preview-wrapper'>
      <iframe
        ref={iframe}
        sandbox='allow-scripts'
        title='preview'
        srcDoc={html}
      />
    </div>
  );
};

export default Preview;
