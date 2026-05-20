import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'

export const TasksSkeleton = () => (
  <Box style={{ padding: '8px 0' }}>
    {Array.from({ length: 4 }, (_, id) => (
      <Box key={id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }} style={{ gap: '15px' }}>
          <Skeleton width={20} height={40} />
          <Skeleton width={150} height={40} />
        </Box>
        <Skeleton width={20} height={40} />
      </Box>
    ))}
  </Box>
)
