import { AnimateSharedLayout, motion } from 'framer-motion';
import { Cell } from '../state';
import CodeCell from './CodeCell';
import TextEditor from './TextEditor';
import ActionBar from './ActionBar';
import '../styles/cell-list-item.css';

interface CellListItemProps {
  cell: Cell;
}

const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  let child: JSX.Element;
  if (cell.type === 'code') {
    child = (
      <>
        <AnimateSharedLayout>
          <motion.div layout>
            <div className='action-bar-wrapper'>
              <ActionBar id={cell.id} />
            </div>
            <CodeCell cell={cell} />
          </motion.div>
        </AnimateSharedLayout>
      </>
    );
  } else {
    child = (
      <>
        <AnimateSharedLayout>
          <motion.div layout>
            <TextEditor cell={cell} />
            <ActionBar id={cell.id} />
          </motion.div>
        </AnimateSharedLayout>
      </>
    );
  }

  return <div className='cell-list-item'>{child}</div>;
};

export default CellListItem;
