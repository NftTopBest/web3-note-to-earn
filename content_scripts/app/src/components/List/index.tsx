// Components
import { Box } from '@mantine/core';
import { PostInfo } from '../../App';
import { noop } from '../../utils/functionality';
import Item from './Item';

type ListProps = {
  list: PostInfo[];
  onItemSelected?: (key: string | number) => void;
};

function List(props: ListProps) {
  const { list, onItemSelected = noop } = props;
  return (
    <Box>
      {list.map((item, index) => (
        <Item onClick={() => onItemSelected(index)} key={index} data={item} />
      ))}
    </Box>
  );
}

export default List;
