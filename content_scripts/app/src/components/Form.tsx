import { useEffect, useMemo, useState } from 'react';
// Components
import { Button, Group, Box, Textarea, MultiSelect, TextInput, Switch, LoadingOverlay } from '@mantine/core';
import { RichTextEditor } from '@mantine/rte';
// Hooks
import { useForm, zodResolver } from '@mantine/form';
// utils
import { z } from 'zod';
import { UserInfo } from '../App';
import { noop } from '../utils/functionality';
import { showNotification } from '@mantine/notifications';
import { useWallet } from '../provider/WalletProvider';
import { useLit } from '../provider/LitProvider';

export type PostInfoProps = {
  age: number;
  tags: string[];
  email: string;
  title: string;
  excerpt: string;
  content: string;
  isPublic: boolean;
  address: string;
};

const data = [
  { value: 'NFT', label: 'NFT' },
  { value: 'Developer', label: 'Developer' },
  { value: 'Metaverse', label: 'Metaverse' },
  { value: 'Defi', label: 'Defi' },
  { value: 'GameFi', label: 'GameFi' },
];

const schema = z.object({
  excerpt: z.string().min(2, { message: 'Excerpt should have at least 8 letters' }),
  email: z.string().email({ message: 'Invalid email' }),
  age: z.number().min(18, { message: 'You must be at least 18 to create an account' }),
  title: z.string().min(2, { message: 'You must be at least 2 to create an account' }),
  isPublic: z.boolean(),
  tags: z.array(z.string()),
  content: z.string(),
});

type FormProps = {
  onPreviousClick: () => void;
  userInfo?: UserInfo | null;
  onSaveSuccess?: () => void;
};

function Form(props: FormProps) {
  const { onPreviousClick, userInfo, onSaveSuccess = noop } = props;
  const { account } = useWallet();
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [value, onChange] = useState('<p>Type @ or # to see mentions autocomplete</p>');
  const { encryptPost } = useLit();

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      age: 0,
      tags: [],
      email: '',
      title: '',
      excerpt: '',
      content: '',
      isPublic: true,
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    showNotification({
      id: 'submitting',
      disallowClose: true,
      onClose: () => console.log('unmounted'),
      onOpen: () => console.log('mounted'),
      autoClose: 2000,
      title: 'Submitting',
      message: 'Uploading your post...',
      loading,
    });
    await encryptPost({
      account,
      ...form.values,
      content: value,
      author: userInfo?.address,
    });
    setLoading(false);
    onSaveSuccess();
  };

  useEffect(() => {
    form.reset();
  }, []);

  return (
    <Box sx={{ width: '90%', marginTop: '48px', maxWidth: 900 }} mx="auto">
      <LoadingOverlay visible={loading} />
      <form onSubmit={handleSubmit}>
        <TextInput required label="Title" placeholder="Please input your title here" {...form.getInputProps('title')} />
        <Textarea
          sx={{ marginTop: '24px' }}
          placeholder="Your Excerpt"
          label="Write your excerpt here"
          required
          {...form.getInputProps('excerpt')}
        />
        <MultiSelect
          sx={{ marginTop: 24, marginBottom: 36 }}
          data={data}
          label="Your tags"
          placeholder="Pick all that you like"
          {...form.getInputProps('tags')}
        />
        <RichTextEditor
          value={value}
          onChange={onChange}
          placeholder="Type @ or # to see mentions autocomplete"
          style={{
            minHeight: 300,
          }}
        />
        <Switch
          sx={{ marginTop: '60px' }}
          size="md"
          checked={isPublic}
          onClick={() => setIsPublic((prev) => !prev)}
          {...form.getInputProps('isPublic')}
          label={isPublic ? 'public' : 'privacy'}
        />
        <Group position="right" mt="64px">
          <Button variant="light" onClick={onPreviousClick}>
            Previous
          </Button>
          <Button type="submit">Save</Button>
        </Group>
      </form>
    </Box>
  );
}

export default Form;
