
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  summary: z.string().min(10, 'Summary must be at least 10 characters.'),
  imageUrl: z.string().optional().or(z.literal('')),
});

export default function EditProfileDialog({
  isOpen,
  onOpenChange,
  onProfileUpdate,
  profile,
}) {
  const { toast } = useToast()
  const [uploadType, setUploadType] = useState('url');
  const [imagePreview, setImagePreview] = useState('');
  
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      summary: '',
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset(profile);
      setImagePreview(profile.imageUrl || '');
      // Determine initial upload type
      if (profile.imageUrl && profile.imageUrl.startsWith('data:image')) {
        setUploadType('upload');
      } else {
        setUploadType('url');
      }
    }
  }, [profile, form, isOpen]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 2MB.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        form.setValue('imageUrl', result);
        setImagePreview(result);
      };
      reader.onerror = () => {
         toast({
          variant: "destructive",
          title: "Error reading file",
          description: "There was a problem uploading your image.",
        });
      }
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values) => {
    const profileToUpdate = { ...values };
    if (!profileToUpdate.imageUrl) {
        profileToUpdate.imageUrl = 'https://picsum.photos/seed/teacher/200/200';
    }
    onProfileUpdate(profileToUpdate);
    onOpenChange(false);
  };
  
  const watchedImageUrl = form.watch('imageUrl');

  useEffect(() => {
    if (uploadType === 'url' && !watchedImageUrl?.startsWith('data:')) {
      setImagePreview(watchedImageUrl);
    }
  }, [watchedImageUrl, uploadType]);


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your name, portfolio summary, and profile image.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 'Professor Smith'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="You could write some introduction about yourself, your wisdoms for today or things to do. Have a productive day!"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <RadioGroup value={uploadType} onValueChange={setUploadType} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="url" id="url" />
                  <Label htmlFor="url">From URL</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upload" id="upload" />
                  <Label htmlFor="upload">Upload from Computer</Label>
                </div>
              </RadioGroup>
            </FormItem>

            {uploadType === 'url' ? (
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="https://... (leave blank for default)" 
                        {...field}
                        value={field.value?.startsWith('data:image') ? '' : field.value} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
               <FormItem>
                  <FormControl>
                    <Input 
                      id="picture"
                      type="file" 
                      accept="image/png, image/jpeg, image/gif"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </FormControl>
                  <Label htmlFor="picture" className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer")}>
                     <Upload className="mr-2 h-4 w-4" />
                     Choose File
                  </Label>
                  <FormMessage />
                </FormItem>
            )}

            {imagePreview && (
              <div className="mt-4 flex flex-col items-center">
                 <Label className="mb-2">Image Preview</Label>
                 <Image
                    src={imagePreview}
                    alt="Profile preview"
                    width={128}
                    height={128}
                    className="rounded-full object-cover border-4 border-muted"
                 />
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
