// Components
import { Text, Box, Avatar, Group, Title, Badge } from '@mantine/core';
import { PostInfo } from '../../App';
import { noop } from '../../utils/functionality';
import { defaultAvatar } from '../../utils/mock';

export type ListItemProps = {
  data: PostInfo;
  onClick?: () => void;
};

function Item(props: ListItemProps) {
  const {
    onClick = noop,
    data: { title, excerpt, tags },
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
          <Avatar size="lg" src={defaultAvatar} />
        </Group>
      </Box>
      <Box>
        <Box>
          <Title order={3}>{title}</Title>
          <Text>{excerpt}</Text>
        </Box>
        <Box mt={12}>
          {tags &&
            tags.split(',').map((tag, index) => (
              <Badge key={index} size="xs" color="green" sx={{ marginRight: 8 }}>
                {tag}
              </Badge>
            ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Item;
