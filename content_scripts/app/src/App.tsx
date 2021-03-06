import { useEffect, useState } from 'react';
import {
  Drawer,
  Button,
  Text,
  Box,
  Badge,
  Transition,
  TypographyStylesProvider,
  Title,
  Divider,
  Group,
  ActionIcon,
} from '@mantine/core';
import dayjs from 'dayjs';
import { useClickOutside } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { Books, Edit, ThumbUp } from 'tabler-icons-react';
// components
import PostList from './components/PostList';
import Form from './components/Form';
import { useWallet } from './provider/WalletProvider';
// CSS
import './App.css';

export type UserInfo = {
  id: number;
  address: string;
  email: null | string;
  nickName: string;
};

export type PostInfo = {
  age: number;
  thumb: number;
  view: number;
  author: string;
  excerpt: string;
  address: string;
  content: string;
  email: string | null;
  tags: string[];
  title: string;
  isPublic: true;
  created_at?: string;
  updated_at?: string;
};

const TEMP_BADAGE: Record<string, string | number> = {
  blog: 23, // how many article writing on the W3NS/${address}/blog
  nft: '99+', // how many NFT user has buy?
  view: '10K+', // how many page views from other user?
  upVote: '123', // up vote from other users
  downVote: '32', // down vote from other users
};

const COLORS = ['green', 'blue', 'yellow', 'orange'];

const INFO_LIST = Object.keys(TEMP_BADAGE).map((key) => `${TEMP_BADAGE[key]}: ${key}`);

const metadataFilter = {
  keyvalues: {
    type: {
      value: 'note',
      op: 'eq',
    },
  },
};

function App() {
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [userInfo, setUserInfo] = useState<Partial<UserInfo> | null>(null);
  const clickOutsideRef = useClickOutside(() => setExpanded(false));
  const [actived, setActived] = useState(0);
  const [activedTab, setActivedTab] = useState(0);
  const [postInfo, setPostInfo] = useState<PostInfo[]>([]);
  const { showPost, getParsePost } = useWallet();
  const [subscribeList, setSubscribeList] = useState<number[]>([]);

  const goBack = async () => {
    setEditing(false);
    if (activedTab === 0) {
      executeQueryAllPost();
    } else if (activedTab === 1) {
      executeQueryUserPost();
    }
  };

  useEffect(() => {
    executeQueryAllPost();
  }, []);

  const goToEditProfile = () => {
    setEditing(true);
  };

  const executeQueryUserPost = async () => {
    setLoading(true);
    loadingNotification();
    const blogPosts = await getParsePost();
    setPostInfo(blogPosts);
    setLoading(false);
  };

  const executeQueryAllPost = async () => {
    setLoading(true);
    loadingNotification();
    const blogPosts = await getParsePost();
    setPostInfo(blogPosts.filter((item: any) => item.isPublic));
    setLoading(false);
  };

  const parse = async (data: any) => {
    return showPost(data);
  };

  const clickTabHandler = (index: number) => {
    setActivedTab(index);
    if (index === 0) {
      executeQueryAllPost();
    } else if (index === 1) {
      executeQueryUserPost();
    }
  };

  const loadingNotification = () => {
    showNotification({
      id: 'fetch-loading',
      disallowClose: true,
      onClose: () => console.log('unmounted'),
      onOpen: () => console.log('mounted'),
      autoClose: 2000,
      title: 'Fetching',
      message: 'Leave the building immediately',
      loading,
    });
  };

  return (
    <Box className="App">
      <Drawer
        opened={opened}
        position="right"
        onClose={() => setOpened(false)}
        title="Farly Post"
        padding="xl"
        size="75%"
        style={{ position: 'relative' }}
        styles={{
          title: {
            fontSize: 36,
            fontWeight: 600,
          },
          overlay: {
            backgroundColor: '#1011132e !important',
          },
          drawer: {
            minWidth: 1200,
            zIndex: 36,
          },
        }}
      >
        {/* <LoadingOverlay visible={loading} /> */}
        {editing && <Form onPreviousClick={goBack} userInfo={userInfo as UserInfo} onSaveSuccess={goBack} />}
        {!editing && (
          <Box sx={{ display: 'flex' }} m={36}>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              {postInfo && postInfo.length > 0 && (
                <Box sx={{ maxWidth: 900, width: '100%', textAlign: 'left' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <Box>
                      <Title sx={{ color: '#afc3e1' }}>{postInfo[actived].title}</Title>
                      <Text sx={{ marginTop: 12, color: '#86909c', fontSize: 22 }}>{postInfo[actived].excerpt}</Text>
                    </Box>
                    <Box>
                      <Box sx={{ textAlign: 'right', marginBottom: 12 }}>
                        <Text sx={{ color: '#86909c', fontSize: 14 }}>
                          Created at - {dayjs(postInfo[actived].created_at).format('YYYY MM-DD HH:mm')}
                        </Text>
                        <Text sx={{ color: '#86909c', fontSize: 14 }}>
                          Updated at - {dayjs(postInfo[actived].updated_at).format('YYYY MM-DD HH:mm')}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
                    <Box sx={{ flex: 1 }}>
                      {postInfo[actived].tags &&
                        postInfo[actived].tags.map((tag, index) => (
                          <Badge key={index} size="xs" color="green" sx={{ marginRight: 8 }}>
                            {tag}
                          </Badge>
                        ))}
                    </Box>
                    <Group>
                      {!subscribeList.includes(actived) && (
                        <Button
                          variant="light"
                          sx={{
                            marginRight: '12px',
                          }}
                          onClick={async () => {
                            const post = await parse(postInfo[actived]);
                            setPostInfo((prev) => {
                              const posts = [...prev];
                              posts[actived] = post;
                              return posts;
                            });
                            setSubscribeList((prev) => [...prev, actived]);
                          }}
                        >
                          Subscribe
                        </Button>
                      )}
                      <ActionIcon>
                        <ThumbUp size={20} />
                      </ActionIcon>
                      <Text sx={{ fontWeight: 400 }}>{postInfo[actived].thumb}</Text>
                      <ActionIcon>
                        <Books size={20} />
                      </ActionIcon>
                      <Text sx={{ fontWeight: 400 }}>{postInfo[actived].view}</Text>
                    </Group>
                  </Box>

                  <Divider size="lg" sx={{ margin: '24px auto' }} />
                  {
                    <TypographyStylesProvider>
                      <div
                        style={{ width: '100%' }}
                        dangerouslySetInnerHTML={{
                          __html: typeof postInfo[actived].content === 'string' ? postInfo[actived].content : '',
                        }}
                      />
                    </TypographyStylesProvider>
                  }
                </Box>
              )}
            </Box>
            {postInfo && (
              <PostList
                data={postInfo}
                loading={loading}
                onTabSelected={clickTabHandler}
                onItemSelected={(index) => setActived(Number(index))}
                triggerEditChange={goToEditProfile}
              />
            )}
          </Box>
        )}
      </Drawer>

      {!opened && (
        <>
          <Box sx={{ marginTop: '24px', justifyContent: 'flex-end' }}>
            <Button onClick={() => setOpened((prev) => !prev)} leftIcon={<Edit />}>
              Web3 Notes
            </Button>

            <Transition mounted={expanded} transition="slide-left" duration={400} timingFunction="ease">
              {(styles) => (
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
                  style={styles}
                  ref={clickOutsideRef}
                >
                  {INFO_LIST.map((info, index) => (
                    <Badge
                      key={info}
                      sx={{ marginRight: '12px', marginTop: '24px' }}
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
          </Box>
        </>
      )}
    </Box>
  );
}

export default App;
