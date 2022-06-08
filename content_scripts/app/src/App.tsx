import { useState } from 'react';
import {
  Drawer,
  Button,
  Group,
  Box,
  Text,
  List,
  ThemeIcon,
  Timeline,
  Avatar,
  Indicator,
  Paper,
  Badge,
  Transition,
  Blockquote,
} from '@mantine/core';
import {
  BrandTwitter,
  CircleCheck,
  CircleDashed,
  GitBranch,
  GitCommit,
  GitPullRequest,
  InfoSquare,
  MessageDots,
} from 'tabler-icons-react';
import { useClickOutside } from '@mantine/hooks';
import './App.css';

const TEMP_BADAGE: Record<string, string | number> = {
  blog: 23, // how many article writing on the W3NS/${address}/blog
  nft: '99+', // how many NFT user has buy?
  view: '10K+', // how many page views from other user?
  upVote: '123', // up vote from other users
  downVote: '32', // down vote from other users
};

const COLORS = ['green', 'blue', 'yellow', 'orange'];

const INFO_LIST = Object.keys(TEMP_BADAGE).map((key) => `${TEMP_BADAGE[key]}: ${key}`);

function App() {
  const [opened, setOpened] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const clickOutsideRef = useClickOutside(() => setExpanded(false));

  const avatar = <Avatar alt="Avatar for badge" size={24} mr={5} src="image-link" />;

  return (
    <Box className="App">
      <Drawer opened={opened} position="right" onClose={() => setOpened(false)} title="Register" padding="xl" size="xl">
        <Paper shadow="xl" p="md">
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ marginRight: '24px' }}>
              <Group position="center">
                <Indicator>
                  <Avatar
                    size="lg"
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80"
                  />
                </Indicator>
              </Group>
            </Box>
            <Box>
              <Text>Paper is the most basic ui component</Text>
              <Text>
                Use it to create cards, dropdowns, modals and other components that require background with shadow
              </Text>
            </Box>
          </Box>
          <Blockquote cite="– Forrest Gump">
            Life is like an npm install – you never know what you are going to get.
          </Blockquote>
        </Paper>

        <List
          spacing="xs"
          size="sm"
          center
          sx={{
            marginTop: '36px',
          }}
          icon={
            <ThemeIcon color="teal" size={24} radius="xl">
              <CircleCheck size={16} />
            </ThemeIcon>
          }
        >
          <List.Item>Clone or download repository from GitHub</List.Item>
          <List.Item>Install dependencies with yarn</List.Item>
          <List.Item>To start development server run npm start command</List.Item>
          <List.Item>Run tests to make sure your changes do not break the build</List.Item>
          <List.Item
            icon={
              <ThemeIcon color="blue" size={24} radius="xl">
                <CircleDashed size={16} />
              </ThemeIcon>
            }
          >
            Submit a pull request once you are done
          </List.Item>
        </List>

        <Timeline sx={{ marginTop: '36px' }} active={1} bulletSize={24} lineWidth={2}>
          <Timeline.Item bullet={<GitBranch size={12} />} title="New branch">
            <Text color="dimmed" size="sm">
              You&apos;ve created new branch{' '}
              <Text variant="link" component="span" inherit>
                fix-notifications
              </Text>{' '}
              from master
            </Text>
            <Text size="xs" mt={4}>
              2 hours ago
            </Text>
          </Timeline.Item>

          <Timeline.Item bullet={<GitCommit size={12} />} title="Commits">
            <Text color="dimmed" size="sm">
              You&apos;ve pushed 23 commits to
              <Text variant="link" component="span" inherit>
                fix-notifications branch
              </Text>
            </Text>
            <Text size="xs" mt={4}>
              52 minutes ago
            </Text>
          </Timeline.Item>

          <Timeline.Item title="Pull request" bullet={<GitPullRequest size={12} />} lineVariant="dashed">
            <Text color="dimmed" size="sm">
              You&apos;ve submitted a pull request
              <Text variant="link" component="span" inherit>
                Fix incorrect notification message (#187)
              </Text>
            </Text>
            <Text size="xs" mt={4}>
              34 minutes ago
            </Text>
          </Timeline.Item>

          <Timeline.Item title="Code review" bullet={<MessageDots size={12} />}>
            <Text color="dimmed" size="sm">
              <Text variant="link" component="span" inherit>
                Robert Gluesticker
              </Text>{' '}
              left a code review on your pull request
            </Text>
            <Text size="xs" mt={4}>
              12 minutes ago
            </Text>
          </Timeline.Item>
        </Timeline>
      </Drawer>

      {!opened && (
        <>
          <Box sx={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <Transition mounted={expanded} transition="slide-left" duration={400} timingFunction="ease">
              {(styles) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }} style={styles} ref={clickOutsideRef}>
                  {INFO_LIST.map((info, index) => (
                    <Badge
                      key={info}
                      sx={{ marginRight: '12px' }}
                      size="lg"
                      radius="xl"
                      color={COLORS[index % COLORS.length]}
                    >
                      {info}
                    </Badge>
                  ))}
                </Box>
              )}
            </Transition>
            <Button
              onClick={() => setExpanded((prev) => !prev)}
              leftIcon={<InfoSquare />}
              variant="filled"
              color="teal"
            >
              Profile
            </Button>
          </Box>
          <Button
            onClick={() => setOpened(true)}
            leftIcon={<BrandTwitter size={18} />}
            styles={(theme) => ({
              root: {
                '&:hover': {
                  backgroundColor: theme.fn.darken('#00acee', 0.05),
                },
              },
            })}
          >
            Follow
          </Button>
        </>
      )}
    </Box>
  );
}

export default App;
