// Components
import { Text, Box, Avatar, Group, Title, Badge } from '@mantine/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { PostInfo } from '../../App';
import { noop } from '../../utils/functionality';
import { defaultAvatar } from '../../utils/mock';

dayjs.extend(relativeTime);

export type ListItemProps = {
  data: PostInfo;
  onClick?: () => void;
};

function Item(props: ListItemProps) {
  const {
    onClick = noop,
    data: { title, excerpt, tags, updated_at },
  } = props;

  return (
    <Box
      onClick={onClick}
      sx={{
        'display': 'flex',
        'width': '100%',
        'boxSizing': 'border-box',
        'padding': 18,
        '&:hover': { backgroundColor: '#33353dc2' },
      }}
    >
      <Box sx={{ marginRight: '24px' }}>
        <Group position="center">
          <Avatar size="md" src={defaultAvatar} />
        </Group>
      </Box>
      <Box>
        <Box>
          <Title order={5}>{title}</Title>
          <Text size="sm">{excerpt}</Text>
        </Box>
        <Box mt={12}>
          <Text size="xs" color="#6e6e6e" sx={{ marginTop: 12 }}>
            {dayjs().to(dayjs(updated_at))}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

export default Item;
