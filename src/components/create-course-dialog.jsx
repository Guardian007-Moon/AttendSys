'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Image, BookOpen, Calendar, Hash, FileText } from 'lucide-react';

const courseSchema = z.object({
  name: z.string().min(5, 'Course name must be at least 5 characters.'),
  code: z.string().optional(),
  description: z.string().optional(),
  year: z.string({ required_error: 'Please select a year.' }),
  bannerUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
});

const academicYears = ['1', '2', '3', '4', '5'];

export default function CreateCourseDialog({
  isOpen,
  onOpenChange,
  onCourseCreate,
}) {
  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      year: '',
      bannerUrl: '',
    },
  });

  const onSubmit = (values) => {
    onCourseCreate(values);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-xl">
        <div className="relative">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6">
            <DialogHeader className="text-left">
              <DialogTitle className="text-white text-2xl font-bold flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                Create New Course
              </DialogTitle>
              <DialogDescription className="text-white/90 mt-1">
                Fill in the details to create a new course for your students.
              </DialogDescription>
            </DialogHeader>
            
            {/* Close button - This is removed as DialogContent already provides one */}
          </div>

          {/* Form content */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Course Name
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 'Creative Writing 101'" 
                        className="rounded-lg py-2.5 px-3.5"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <Hash className="h-4 w-4 text-primary" />
                        Course Code
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., 'CW101'" 
                          className="rounded-lg py-2.5 px-3.5"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="h-4 w-4 text-primary" />
                        Academic Year
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-lg py-2.5 px-3.5">
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-lg">
                          {academicYears.map(year => (
                            <SelectItem key={year} value={year} className="py-2.5">
                              Year {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <FileText className="h-4 w-4 text-primary" />
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the course content and objectives..."
                        className="rounded-lg py-2.5 px-3.5 min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bannerUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <Image className="h-4 w-4 text-primary" />
                      Banner Image URL
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/banner.jpg" 
                        className="rounded-lg py-2.5 px-3.5"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {/* Footer with actions */}
          <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex w-full justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                onClick={form.handleSubmit(onSubmit)}
                className="bg-primary hover:bg-primary/90 shadow-md rounded-lg px-5"
              >
                Create Course
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
