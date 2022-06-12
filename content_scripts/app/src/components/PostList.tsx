// Lib components
import { Box, Button, Card, ScrollArea, Tabs } from '@mantine/core';
import { Photo, MessageCircle, Settings } from 'tabler-icons-react';
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
    <Box
      sx={{
        marginLeft: 24,
        minWidth: 500,
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      <Button sx={{ marginBottom: 48 }} onClick={triggerEditChange}>
        Create Post
      </Button>
      <Tabs>
        <Tabs.Tab label="Gallery" icon={<Photo size={14} />}>
          Gallery tab content
        </Tabs.Tab>
        <Tabs.Tab label="Messages" icon={<MessageCircle size={14} />}>
          Messages tab content
        </Tabs.Tab>
        <Tabs.Tab label="Settings" icon={<Settings size={14} />}>
          Settings tab content
        </Tabs.Tab>
      </Tabs>

      <ScrollArea style={{ width: '90%', height: '100%', borderRadius: 8 }}>
        <Card shadow="xl" sx={{ width: '100%' }} mx="auto">
          <List list={data} onItemSelected={onItemSelected} />
        </Card>
      </ScrollArea>
    </Box>
  );
}

export default PostList;
