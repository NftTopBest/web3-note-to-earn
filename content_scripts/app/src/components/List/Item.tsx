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
        '&:hover': { backgroundColor: '#33353dc2' },
      }}
      p={18}
      px={4}
    >
      <Box sx={{ marginRight: '24px' }}>
        <Group position="center">
          <Avatar size="xl" src={defaultAvatar} />
        </Group>

      </Box>
      <Box>
        <Box>
          <Title order={5}>{title}</Title>
          <Text size="sm">{excerpt}</Text>
        </Box>
        <Box mt={12}>
          {tags &&
            tags.split(',').map((tag, index) => (
              <Badge key={index} size="xs" color="green" sx={{ marginRight: 8 }}>
                {tag}
              </Badge>
            ))}
              <Text sx={{ marginTop: 12 }}>{dayjs().to(dayjs(updated_at))}</Text>
        </Box>
      </Box>
    </Box>
  );
}

export default Item;
