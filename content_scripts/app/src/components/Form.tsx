import { useState } from 'react';
// Components
import { Button, Group, Box, Textarea, MultiSelect, TextInput, Switch } from '@mantine/core';
// Hooks
import { useForm, zodResolver } from '@mantine/form';
// utils
import { z } from 'zod';
import { UserInfo } from '../App';
import { useSubpaseContext } from '../provider/SubpaseProvider'

const data = [
  { value: 'react', label: 'React' },
  { value: 'ng', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'vue', label: 'Vue' },
  { value: 'riot', label: 'Riot' },
  { value: 'next', label: 'Next.js' },
  { value: 'blitz', label: 'Blitz.js' },
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
};

function Form(props: FormProps) {
  const { onPreviousClick, userInfo } = props;
  const [isPublic, setIsPublic] = useState(true);
  const { save } = useSubpaseContext();

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
    event.preventDefault();
    console.log('form.values; ', form.values);
    save({
      ...form.values,
      tags: form.values.tags.join(','),
      author: userInfo?.address,
    });
  };

  return (
    <Box sx={{ width: '90%', marginTop: '48px' }} mx="auto">
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
          sx={{ marginTop: '24px' }}
          data={data}
          label="Your tags"
          placeholder="Pick all that you like"
          {...form.getInputProps('tags')}
        />
        <Textarea
          sx={{ marginTop: '24px' }}
          placeholder="News"
          label="Your blog here"
          autosize
          minRows={6}
          {...form.getInputProps('content')}
        />
        <Switch
          sx={{ marginTop: '24px' }}
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