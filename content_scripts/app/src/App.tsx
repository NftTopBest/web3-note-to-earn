import { useEffect, useState } from 'react';
import { Drawer, Button, Box, Badge, Transition } from '@mantine/core';
import { BrandTwitter, InfoSquare } from 'tabler-icons-react';
import { useClickOutside } from '@mantine/hooks';
import './App.css';
import Form from './components/Form';
import UserProfile from './components/UserProfile';


export type UserInfo = {
  id: number;
  address: string;
  email: null | string;
  nickName: string;
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
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const clickOutsideRef = useClickOutside(() => setExpanded(false));


  const goBack = () => {
    setEditing(false);
  };

  const goToEditProfile = () => {
    setEditing(true);
  };

  useEffect(() => {
    // 监听链接
    chrome.runtime?.onConnect.addListener((res) => {
      if (res.name === 'popup') {
        res.onMessage.addListener((user: UserInfo) => {
          console.log('🥓: popup.js receive', user);
          if (user) {
            setUserInfo(user);
          }
        });
      }
    });
  }, []);

  return (
    <Box className="App">
      <Drawer opened={opened} position="right" onClose={() => setOpened(false)} title="My Brand" padding="xl" size="xl">
        <>
          {editing && <Form onPreviousClick={goBack} />}
          {!editing && <UserProfile goToEdit={goToEditProfile} userInfo={userInfo} />}
        </>
      </Drawer>

      {!opened && (
        <>
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
          <Box sx={{ marginTop: '24px', justifyContent: 'flex-end' }}>
            <Button
              onClick={() => setExpanded((prev) => !prev)}
              leftIcon={<InfoSquare />}
              variant="filled"
              color="teal"
            >
              Profile
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
