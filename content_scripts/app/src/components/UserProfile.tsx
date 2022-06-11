import { Group, Box, Text, Avatar, Indicator, Paper, Blockquote, Button, Title } from '@mantine/core';
import { UserInfo } from '../App';
import { useEffect, useState } from 'react';
import { useSubpaseContext } from '../provider/SubpaseProvider';
import { useWallet } from '../provider/WalletProvider';

type UserProfileProps = {
  goToEdit: () => void;
  userInfo?: UserInfo | null;
};

function UserProfile(props: UserProfileProps) {
  const { goToEdit, userInfo } = props;
  const [userInfoInner, setUserInfo] = useState<any>({});
  const { getUserInfo } = useSubpaseContext();

  useEffect(() => {
    (async () => {
      if (userInfo?.address) {
        const data = await getUserInfo(userInfo?.address);

        console.log('Form request data ', data);
        setUserInfo(data);
      }
    })();
  }, [userInfo]);

  const userInfoKeys = Object.keys(userInfoInner);

  console.log("userInfoKeys ", userInfoKeys);

  return (
    <>
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
            <Text size="xs">Account: {userInfo?.address}</Text>

            <Text>
              Use it to create cards, dropdowns, modals and other components that require background with shadow
            </Text>
          </Box>
        </Box>
        <Blockquote cite="– Forrest Gump">
          Life is like an npm install – you never know what you are going to get.
        </Blockquote>
      </Paper>

      <Box>
        {userInfoKeys.length > 0 &&
          userInfoKeys.map((key) => (
            <Box key={key} sx={{ marginTop: "24px"}}>
              <Title order={3}>{key}</Title>
              <Text size="lg">{userInfoInner[key]}</Text>
            </Box>
          ))}
      </Box>

      <Group position="right" mt="64px">
        <Button onClick={goToEdit} variant="light">
          Edit
        </Button>
      </Group>
    </>
  );
}

export default UserProfile;
