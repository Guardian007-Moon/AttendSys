'use client';

import { useEffect } from 'react';
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
import { X, Image, BookOpen, Calendar, Hash, FileText, Save } from 'lucide-react';

const courseSchema = z.object({
  name: z.string().min(1, 'Course name is required.'),
  code: z.string().optional(),
  description: z.string().optional(),
  year: z.string({ required_error: 'Please select a year.' }),
  bannerUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
});

const academicYears = ['1', '2', '3', '4', '5'];

export default function EditCourseDialog({
  isOpen,
  onOpenChange,
  onCourseUpdate,
  course,
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

  useEffect(() => {
    if (course) {
      form.reset(course);
    }
  }, [course, form]);

  const onSubmit = (values) => {
    onCourseUpdate({ ...course, ...values });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-xl">
        <div className="relative">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
            <DialogHeader className="text-left">
              <DialogTitle className="text-white text-2xl font-bold flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                Edit Course
              </DialogTitle>
              <DialogDescription className="text-white/90 mt-1">
                Update the details for your course to keep information current.
              </DialogDescription>
            </DialogHeader>
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
                      <BookOpen className="h-4 w-4 text-blue-500" />
                      Course Name
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 'Creative Writing 101'" 
                        className="rounded-lg py-2.5 px-3.5 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
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
                        <Hash className="h-4 w-4 text-blue-500" />
                        Course Code
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., 'CW101'" 
                          className="rounded-lg py-2.5 px-3.5 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        Academic Year
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-lg py-2.5 px-3.5 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
                      <FormMessage className="text-xs text-red-500" />
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
                      <FileText className="h-4 w-4 text-blue-500" />
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the course content and objectives..."
                        className="rounded-lg py-2.5 px-3.5 min-h-[100px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bannerUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <Image className="h-4 w-4 text-blue-500" />
                      Banner Image URL
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/banner.jpg" 
                        className="rounded-lg py-2.5 px-3.5 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
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
                className="bg-blue-600 hover:bg-blue-700 shadow-md rounded-lg px-5 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
