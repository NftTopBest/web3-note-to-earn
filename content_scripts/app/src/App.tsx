import { useEffect, useState } from 'react';
import { Drawer, Button, Box, Badge, Transition, TypographyStylesProvider, LoadingOverlay } from '@mantine/core';
import { Edit } from 'tabler-icons-react';
// import { BrandTwitter, InfoSquare } from 'tabler-icons-react';
import { useClickOutside } from '@mantine/hooks';
import './App.css';
import Form from './components/Form';
import PostList from './components/PostList';
import { useSubpaseContext } from './provider/SubpaseProvider';

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
  content: string;
  email: string | null;
  tags: string | null;
  title: string;
  isPublic: true;
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

function App() {
  const { getUserPost } = useSubpaseContext();
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [userInfo, setUserInfo] = useState<Partial<UserInfo> | null>(null);
  const clickOutsideRef = useClickOutside(() => setExpanded(false));
  const [activedContent, setActivedContent] = useState('');
  const [postInfo, setPostInfo] = useState<PostInfo[]>([]);

  const goBack = async () => {
    setEditing(false);
  };

  const goToEditProfile = () => {
    setEditing(true);
  };

  useEffect(() => {
    (async () => {
      if (!editing) {
        setLoading(true);
        const post = await getUserPost(userInfo?.address);
        setPostInfo(post);
        setLoading(false);
      }
    })();
  }, [editing]);

  useEffect(() => {
    const account = localStorage.getItem('account') ?? '';
    if (account) {
      setUserInfo((prev) => ({
        ...prev,
        address: account,
      }));
    }

    // 监听链接
    chrome.runtime?.onConnect.addListener((res) => {
      if (res.name === 'popup') {
        res.onMessage.addListener(async (user: UserInfo) => {
          console.log('🥓: popup.js receive', user);
          if (user && user?.address) {
            setLoading(true);
            localStorage.setItem('account', user?.address);
            const post = await getUserPost(user?.address);
            setPostInfo(post);
            setUserInfo(user);
            setLoading(false);
          }
        });
      }
    });
  }, []);

  return userInfo?.address ? (
    <Box className="App">
      <Drawer
        opened={opened}
        position="right"
        onClose={() => setOpened(false)}
        title="Farly Post"
        padding="xl"
        size="full"
        style={{ position: 'relative' }}
        styles={{
          title: {
            fontSize: 36,
            fontWeight: 600,
          },
          overlay: {
            backgroundColor: '#1011132e !important',
          },
        }}
      >
        <LoadingOverlay visible={loading} />
        {editing && <Form onPreviousClick={goBack} userInfo={userInfo as UserInfo} onSaveSuccess={goBack} />}
        {!editing && (
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              {postInfo && postInfo.length > 0 && (
                <Box sx={{ maxWidth: 900, width: '100%', textAlign: 'left' }}>
                  <TypographyStylesProvider>
                    <div style={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: activedContent }} />
                  </TypographyStylesProvider>
                </Box>
              )}
            </Box>
            {postInfo && (
              <PostList
                data={postInfo}
                onItemSelected={(index) => setActivedContent(postInfo[Number(index)]?.content)}
                triggerEditChange={goToEditProfile}
              />
            )}
            {/* <Web3RichTextEditor content={activedContent} /> */}
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
  ) : null;
}

export default App;
