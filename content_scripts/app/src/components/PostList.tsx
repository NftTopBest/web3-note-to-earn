// Lib components
import { Box, Button, Card, ScrollArea, Tabs, TabsProps } from '@mantine/core';
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
        maxWidth: 500,
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      <Tabs
        styles={{
          body: { height: '100%' },
          tabInner: { fontSize: 20, fontWeight: 600 },
          tabsListWrapper: { marginBottom: 12 }
        }}
      >
        <Tabs.Tab sx={{ height: '100%' }} label="Gallery">
          <ScrollArea style={{ width: '100%', height: 900, borderRadius: 8 }}>
            <Card shadow="xl" sx={{ width: '100%', minHeight: "100%" }} mx="auto">
              <List list={data} onItemSelected={onItemSelected} />
            </Card>
          </ScrollArea>
        </Tabs.Tab>
        <Tabs.Tab sx={{ height: '100%' }} label="Messages" >
          <ScrollArea style={{ width: '100%', height: 800, borderRadius: 8 }}>
            <Card shadow="xl" sx={{ width: '100%', minHeight: "100%" }} mx="auto">
              <List list={data} onItemSelected={onItemSelected} />
            </Card>
          </ScrollArea>
        </Tabs.Tab>
        <Tabs.Tab sx={{ height: '100%' }} label="Settings">
          <ScrollArea style={{ width: '100%', height: 800, borderRadius: 8 }}>
            <Card shadow="xl" sx={{ width: '100%', minHeight: "100%" }} mx="auto">
              <List list={data} onItemSelected={onItemSelected} />
            </Card>
          </ScrollArea>
        </Tabs.Tab>
      </Tabs>
      <Button sx={{ marginTop: 48 }} onClick={triggerEditChange}>
        Create Post
      </Button>
    </Box>
  );
}

export default PostList;
