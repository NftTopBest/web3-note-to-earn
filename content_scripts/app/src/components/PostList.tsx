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

function StyledTabs(props: TabsProps) {
  return (
    <Tabs
      variant="unstyled"
      styles={(theme) => ({
        tabControl: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
          color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[9],
          border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[4]}`,
          fontSize: theme.fontSizes.md,
          padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,

          '&:not(:first-of-type)': {
            borderLeft: 0,
          },

          '&:first-of-type': {
            borderTopLeftRadius: theme.radius.md,
            borderBottomLeftRadius: theme.radius.md,
          },

          '&:last-of-type': {
            borderTopRightRadius: theme.radius.md,
            borderBottomRightRadius: theme.radius.md,
          },
        },

        tabActive: {
          backgroundColor: theme.colors.blue[7],
          borderColor: theme.colors.blue[7],
          color: theme.white,
        },
      })}
      {...props}
    />
  );
}


function PostList({ data, onItemSelected = noop, triggerEditChange = noop }: PostListProps) {
  return (
    <Box
      sx={{
        marginLeft: 24,
        minWidth: 500,
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      <StyledTabs
        styles={{
          body: { height: '100%' },
        }}
      >
        <Tabs.Tab sx={{ height: '100%' }} label="Gallery" icon={<Photo size={14} />}>
          <ScrollArea style={{ width: '100%', height: 800, borderRadius: 8 }}>
            <Card shadow="xl" sx={{ width: '100%' }} mx="auto">
              <List list={data} onItemSelected={onItemSelected} />
            </Card>
          </ScrollArea>
        </Tabs.Tab>
        <Tabs.Tab sx={{ height: '100%' }} label="Messages" icon={<MessageCircle size={14} />}>
          <ScrollArea style={{ width: '100%', height: 800, borderRadius: 8 }}>
            <Card shadow="xl" sx={{ width: '100%' }} mx="auto">
              <List list={data} onItemSelected={onItemSelected} />
            </Card>
          </ScrollArea>
        </Tabs.Tab>
        <Tabs.Tab sx={{ height: '100%' }} label="Settings" icon={<Settings size={14} />}>
          <ScrollArea style={{ width: '100%', height: 800, borderRadius: 8 }}>
            <Card shadow="xl" sx={{ width: '100%' }} mx="auto">
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
