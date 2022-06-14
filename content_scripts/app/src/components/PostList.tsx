// Lib components
import { Box, Button, Card, ScrollArea, Skeleton, Tabs } from '@mantine/core';
import { PostInfo } from '../App';
import { noop } from '../utils/functionality';
// Components
import List from './List';

type PostListProps = {
  data: PostInfo[];
  loading: boolean;
  triggerEditChange?: () => void;
  onItemSelected?: (key: string | number) => void;
  onTabSelected?: (index: number) => void;
};

function PostList({
  loading,
  data,
  onTabSelected = noop,
  onItemSelected = noop,
  triggerEditChange = noop,
}: PostListProps) {
  return (
    <Box
      sx={{
        marginLeft: 84,
        maxWidth: 400,
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      <Tabs
        styles={{
          body: { height: '100%' },
          tabInner: { fontSize: 24, fontWeight: 600 },
          tabsListWrapper: { marginBottom: 12 },
        }}
        onTabChange={(index) => onTabSelected(index)}
      >
        <Tabs.Tab sx={{ height: '100%' }} label="ALL">
          <ScrollArea style={{ width: '100%', height: 900, borderRadius: 8 }}>
            <Card shadow="xl" p={0} sx={{ width: '100%', minHeight: '100%' }} mx="auto">
              <Skeleton visible={loading}>
                <List list={data} onItemSelected={onItemSelected} />
              </Skeleton>
            </Card>
          </ScrollArea>
        </Tabs.Tab>
        <Tabs.Tab sx={{ height: '100%' }} label="MY">
          <ScrollArea style={{ width: '100%', height: 900, borderRadius: 8 }}>
            <Card shadow="xl" p={0} sx={{ width: '100%', minHeight: '100%' }} mx="auto">
              <Skeleton visible={loading}>
                <List list={data} onItemSelected={onItemSelected} />
              </Skeleton>
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
