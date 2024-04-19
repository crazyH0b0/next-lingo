import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';
import React from 'react';
import { useKey } from 'react-use';
import { useMedia } from 'react-use';

interface FooterProps {
  status: 'correct' | 'wrong' | 'none' | 'completed';
  onCheck: () => void;
  disabled?: boolean;
  lessonId?: boolean;
}

const Footer = ({ disabled, status, onCheck, lessonId }: FooterProps) => {
  const isMobile = useMedia('(max-width: 1024px)');
  useKey('Enter', onCheck, {}, [onCheck]);

  return (
    <footer
      className={cn(
        'lg:h-[140px] h-[100px] border-t-2',
        status === 'correct' && 'bg-transparent bg-green-100',
        status === 'wrong' && 'bg-transparent bg-rose-100'
      )}
    >
      <div
        className="max-w-[1140px] h-full mx-auto px-6 lg:px-10 
    flex items-center justify-between"
      >
        {status === 'correct' && (
          <div
            className="text-green-500 font-bold text-base lg:text-2xl
          flex items-center
          "
          >
            <CheckCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
            恭喜你，答对了！
          </div>
        )}

        {status === 'wrong' && (
          <div
            className="text-rose-500 font-bold text-base lg:text-2xl
          flex items-center
          "
          >
            <XCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
            答错了，请重试
          </div>
        )}

        {status === 'completed' && (
          <Button
            variant={'default'}
            size={isMobile ? 'sm' : 'lg'}
            onClick={() => {
              window.location.href = `/lesson/${lessonId}`;
            }}
          >
            重新开始
          </Button>
        )}

        <Button
          disabled={disabled}
          className="ml-auto"
          onClick={onCheck}
          size={isMobile ? 'sm' : 'lg'}
          variant={status === 'wrong' ? 'danger' : 'secondary'}
        >
          {status === 'none' && '确定'}
          {status === 'correct' && '下一个'}
          {status === 'wrong' && '重试'}
          {status === 'completed' && '继续'}
        </Button>
      </div>
    </footer>
  );
};
export default Footer;
