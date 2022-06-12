// Lib components
import { Box, Button, Card, ScrollArea } from '@mantine/core';
import { PostInfo } from '../App';
import { noop } from '../utils/functionality';
// Components
import List from './List';

type PostListProps = {
  data: PostInfo[];
  onItemSelected?: (key: string | number) => void;
  triggerEditChange?: () => void;
};

function PostList({ data, onItemSelected = noop, triggerEditChange = noop }: PostListProps) {
  return (
    <Box sx={{ marginLeft: 24, minWidth: 500, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <Button sx={{ marginBottom: 48 }} onClick={triggerEditChange}>
        Create Post
      </Button>
      <ScrollArea style={{ width: '90%', height: '100%', borderRadius: 8 }}>
        <Card shadow="xl" sx={{ width: '100%' }} mx="auto">
          <List list={data} onItemSelected={onItemSelected} />
        </Card>
      </ScrollArea>
    </Box>
  );
}

export default PostList;
