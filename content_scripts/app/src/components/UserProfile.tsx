import { Group, Box, Text, Avatar, Indicator, Paper, Blockquote, Button } from '@mantine/core';
import { useWallet } from '../provider/WalletProvider';

type UserProfileProps = {
  goToEdit: () => void;
};

function UserProfile(props: UserProfileProps) {
  const { goToEdit } = props;
  const { isAuthenticated, connectWallet, disconnectWallet } = useWallet();

  const clickToConnect = async () => {
    if (isAuthenticated) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

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
      {/* TODO - 隐藏调试按钮 */}
      {/* <Group position="right" mt="64px">
        <Button onClick={clickToConnect} variant="light" id="wallet-connect">
          Connect
        </Button>
      </Group> */}

      <Group position="right" mt="64px">
        <Button onClick={goToEdit} variant="light">
          Edit
        </Button>
      </Group>
    </>
  );
}

export default UserProfile;
