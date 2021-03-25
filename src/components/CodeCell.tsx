import { useEffect } from 'react';
import CodeEditor from './CodeEditor';
import Preview from './Preview';
import Resizable from './Resizable';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-types-selector';
import '../styles/code-cell.css';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) =>
    state.bundles ? state.bundles[cell.id] : undefined
  );

  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cell.content);
      return;
    }

    const timer = setTimeout(async () => {
      createBundle(cell.id, cell.content);
    }, 1000);

    return () => clearTimeout(timer);

    // Ignore eslint for bundle not being in the dependency array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell.id, cell.content, createBundle]);

  return (
    <Resizable direction='vertical'>
      <div
        style={{
          height: 'calc(100% - 10px)',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        {!bundle || bundle.loading ? (
          <div className='progress-wrapper'>
            <div className='progress-cover'>
              <progress className='progress is-small is-primary' max='100'>
                Loading
              </progress>
            </div>
          </div>
        ) : (
          <Preview code={bundle.code} err={bundle.err} />
        )}
      </div>
    </Resizable>
  );
};

export default CodeCell;
